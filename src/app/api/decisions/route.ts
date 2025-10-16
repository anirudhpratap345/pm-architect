import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/decisions - List user's decisions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tags = searchParams.get('tags');

    // Build where clause for filtering
    const where: any = {
      createdBy: session.user.email,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (tags) {
      const tagArray = tags.split(',');
      where.tags = {
        hasSome: tagArray
      };
    }

    const decisions = await prisma.decision.findMany({
      where,
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
        notifications: {
          where: {
            userId: session.user.email,
            read: false,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(decisions);
  } catch (error) {
    console.error('Error fetching decisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decisions' },
      { status: 500 }
    );
  }
}

// POST /api/decisions - Create new decision
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.context) {
      return NextResponse.json(
        { error: 'Title and context are required' },
        { status: 400 }
      );
    }

    // Create the decision
    const decision = await prisma.decision.create({
      data: {
        title: body.title,
        description: body.description || body.context,
        context: body.context || body.description,
        status: body.status || 'open',
        priority: body.priority || 'medium',
        options: body.options || [],
        constraints: body.constraints || [],
        metrics: body.metrics || [],
        stakeholders: body.stakeholders || [],
        tags: body.tags || [],
        deadline: body.deadline ? new Date(body.deadline) : null,
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
      },
    });

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    console.error('Error creating decision:', error);
    return NextResponse.json(
      { error: 'Failed to create decision' },
      { status: 500 }
    );
  }
} 