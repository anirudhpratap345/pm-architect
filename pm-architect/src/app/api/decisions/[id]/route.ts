import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/decisions/[id] - Get single decision
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const decision = await prisma.decision.findFirst({
      where: {
        id,
        createdBy: session.user.email,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error('Error fetching decision:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decision' },
      { status: 500 }
    );
  }
}

// PUT /api/decisions/[id] - Update decision
export async function PUT(
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

    // Check if decision exists and user owns it
    const existingDecision = await prisma.decision.findFirst({
      where: {
        id,
        createdBy: session.user.email,
      },
    });

    if (!existingDecision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    // Update the decision
    const updatedDecision = await prisma.decision.update({
      where: { id },
      data: {
        title: body.title,
        description: body.context || body.description,
        context: body.context,
        status: body.status,
        priority: body.priority,
        options: body.options,
        constraints: body.constraints,
        metrics: body.metrics,
        stakeholders: body.stakeholders,
        tags: body.tags,
        deadline: body.deadline ? new Date(body.deadline) : null,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDecision);
  } catch (error) {
    console.error('Error updating decision:', error);
    return NextResponse.json(
      { error: 'Failed to update decision' },
      { status: 500 }
    );
  }
}

// DELETE /api/decisions/[id] - Delete decision
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if decision exists and user owns it
    const existingDecision = await prisma.decision.findFirst({
      where: {
        id,
        createdBy: session.user.email,
      },
    });

    if (!existingDecision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    // Delete the decision (this will cascade delete comments and notifications)
    await prisma.decision.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Decision deleted successfully' });
  } catch (error) {
    console.error('Error deleting decision:', error);
    return NextResponse.json(
      { error: 'Failed to delete decision' },
      { status: 500 }
    );
  }
} 