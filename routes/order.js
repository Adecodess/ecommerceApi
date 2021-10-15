//  require router
const router = require('express').Router();

const Order = require('../models/Order');

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken');

// create order
router.post('/', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).send(savedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
});

// put request to update cart
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },

      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// // delete request to delete user order
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order deleted successfully....');
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// get request to fetch user orders
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders) {
      res.status(401).json('orders not found');
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// // get request to fetch all orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get monthly income

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      { $group: { _id: '$month', total: { $sum: '$sales' } } },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
