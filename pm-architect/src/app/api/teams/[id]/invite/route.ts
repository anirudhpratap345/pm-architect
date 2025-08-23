import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/teams/[id]/invite - Invite a user to a team
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { email, role = 'member' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user has permission to invite (owner or admin)
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: session.user.email,
        role: { in: ['owner', 'admin'] },
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!teamMembership) {
      return NextResponse.json(
        { error: 'You do not have permission to invite members' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: email,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 400 }
      );
    }

    // Check if the invited user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add user to team
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId: email,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create notification for invited user
    await prisma.notification.create({
      data: {
        userId: email,
        decisionId: 'team-invite', // Special ID for team invites
        type: 'team_invite',
        title: 'Team Invitation',
        message: `You've been invited to join the team "${teamMembership.team?.name || 'Unknown Team'}"`,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error inviting user to team:', error);
    return NextResponse.json(
      { error: 'Failed to invite user to team' },
      { status: 500 }
    );
  }
}
