import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../prisma/prisma-client';
import { Request, Response } from 'express';

// Create a new user
export async function signUp(req: Request, res: Response) {
    try {
        const { username, email, password, } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        if (!newUser) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Something went wrong' });
        }
    
        return res.json({ st: true, statusCode: StatusCodes.OK, data: newUser, msg: 'User created successfully' });

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};