import express from "express";
import User from '../models/user.js'

let router = express.Router();
router.post('/register', async (req, res) => {

    try {
        let user = new User()

        res.status(200).json({
            timestamp: Date.now(),
            code: 200,
            user,
            msg: ('success')
        });


    } catch (e) {
        throw new Error(e);
    }
});

router.post('/login', (req, res) => {
    try {
        res.status(200).json({
            timestamp: Date.now(),
            code: 200,
            msg: 'logged in'
        })


    } catch (e) {
        throw new Error(e)
    }
})


router.post('/logout', (req, res) => {
    try {
        res.status(200).json({
            timestamp: Date.now(),
            code: 200,
            msg: 'logged out'
        });


    } catch (e) {
        throw new Error(e)
    }
})

router.all('*', async (res, req) => {
    try {
        res.status(404).json({
            timestamp: Date.now(),
            msg: 'Route does not exist',
            code: 404
        });

    } catch (e) {
        throw new Error(e)
    }
}
)

export default router