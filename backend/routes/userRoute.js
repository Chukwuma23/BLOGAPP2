import express from 'express';

const router = express.Router();

router.get('/anothertest', (req, res) => {
  res.status(200).json({ message: 'user route' });
});

export default router;
