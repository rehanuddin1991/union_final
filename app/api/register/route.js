import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      where:{is_deleted:false}
    });
    return new Response(JSON.stringify({ success: true, users }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name, email and password are required.' }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = req.cookies.get('token')?.value;
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const userId = parseInt(payload.id);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role,insertedBy:userId },
    });

    return new Response(JSON.stringify({ success: true, user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Server error', error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'User ID is required.' }), { status: 400 });
    }

    const { name, email, password, role } = await req.json();

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (role) dataToUpdate.role = role;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    const token = req.cookies.get('token')?.value;
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const userId = parseInt(payload.id);
        dataToUpdate.updatedBy=userId

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    return new Response(JSON.stringify({ success: true, user: updatedUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Update failed', error: error.message }), { status: 500 });
  }
}

 

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required." }),
        { status: 400 }
      );
    }

    // 🔐 Verify JWT token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized: No token" }),
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    // ✅ Soft delete the user
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        is_deleted: true,
        deletedBy: userId,
        
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "User soft-deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Delete failed",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
