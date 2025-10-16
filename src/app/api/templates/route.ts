import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/templates - Get decision templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get public templates and user's own templates
    const templates = await prisma.decisionTemplate.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdBy: session.user.email }
        ]
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            usages: true,
          },
        },
      },
      orderBy: [
        { isPublic: 'desc' },
        { usages: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new decision template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      framework, 
      steps, 
      questions, 
      isPublic = false 
    } = body;

    if (!name || !framework) {
      return NextResponse.json(
        { error: 'Name and framework are required' },
        { status: 400 }
      );
    }

    const template = await prisma.decisionTemplate.create({
      data: {
        name,
        description,
        framework,
        steps: steps || [],
        questions: questions || [],
        isPublic,
        createdBy: session.user.email,
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
