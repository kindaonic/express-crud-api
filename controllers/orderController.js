const db = require('../models');
const Order = db.Order;

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'created_at', order = 'ASC', user_id, product } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (user_id) where.user_id = user_id;
    if (product) where.product = product;

    try {
        const orders = await Order.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order.toUpperCase()]]
        });
        res.status(200).json({
            totalPages: Math.ceil(orders.count / limit),
            currentPage: parseInt(page),
            data: orders.rows
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const [updated] = await Order.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedOrder = await Order.findByPk(req.params.id);
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};