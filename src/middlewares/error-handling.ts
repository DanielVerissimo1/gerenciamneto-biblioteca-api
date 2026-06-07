import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorHandling(
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validation error",
      issues: error.format(),
    });
  }

  if (error.status === 400 && error.type === "entity.parse.failed") {
    return response.status(400).json({ message: "invalid JSON" });
  }

  return response.status(500).json({ message: error.message });
}
