import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import pg from "pg"

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function POST(request: Request) {
  const { query } = await request.json()
  if(!query) {
    return NextResponse.json(
      {message: 'Query is required'},
      {status: 400}
    )
  }

  try {
    let result = await pool.query(query)
    revalidatePath('/')
    return(NextResponse.json(result, {status: 200}))
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}