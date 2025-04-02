import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/authtuah';

const middaRouter = Router();

middaRouter.get(
  '/admin',
  authenticate,
  authorize(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    void res.json({ message: "Welcome, Admin" });
  }
);

middaRouter.get(
  '/moderator',
  authenticate,
  authorize(["MODERATOR", "ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    void res.json({ message: "Welcome, Moderator" });
  }
);

export default middaRouter;
