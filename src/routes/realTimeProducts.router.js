import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts', {
        style: 'style.css'
    }); // De momento solo renderizamos la vista, no pasamos objetos
});

export default router;