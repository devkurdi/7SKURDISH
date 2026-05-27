import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const existingCategories = await db.category.count()

    if (existingCategories > 0) {
      return NextResponse.json(
        { message: 'Categories already exist', count: existingCategories },
        { status: 200 }
      )
    }

    // Create only the 6 default categories
    // Questions should be added through the admin panel
    await db.category.createMany({
      data: [
        { nameBadini: 'ئایینی', nameSorani: 'ئایینی' },
        { nameBadini: 'زانستی', nameSorani: 'زانستی' },
        { nameBadini: 'مێژوویی', nameSorani: 'مێژوویی' },
        { nameBadini: 'جوگرافی', nameSorani: 'جوگرافی' },
        { nameBadini: 'وەرزشی', nameSorani: 'وەرزشی' },
        { nameBadini: 'گشتی', nameSorani: 'گشتی' },
      ],
    })

    return NextResponse.json(
      { message: '6 categories created successfully. Add questions via admin panel.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
