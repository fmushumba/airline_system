import express from "express";
import User from '../models/user.js'
import client from '../../index.js';
import passport from "passport";

let router = express.Router();
router.get('/support', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('support')
    } else {
        res.redirect('sign_in_form')
    }
});
router.get('/', (req, res) => {
    const locals = {
        title: 'Travel buddy home'
    };
    res.render("index", { locals });

})
router.get('/sign_in_form', (req, res) => {
    const locals = {
        title: 'sign up'
    };
    res.render('sign_in_form', { locals })
})

router.get('/sign_up_form', (req, res) => {
    const locals = {
        title: 'sign up'
    };
    res.render('sign_up_form', { locals });
});

router.post('/register', async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body;
        console.log(firstName, lastName, email, password)
        let user = new User();
        let msg = false;
        msg = user.setFirstName(firstName);
        if (msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'first name',
                message: msg
            }
        });
        msg = user.setLastName(lastName);
        if (msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'last name',
                message: msg
            }
        }); msg = user.setEmail(email);
        if (msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'email',
                message: msg
            }
        });
        msg = await user.setPassword(password);
        console.log(msg)
        if (msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'password',
                message: msg
            }
        });
        console.log(user.id)
        console.log(user.name.first)

        console.log(user)
        await user.save(user.id, user.name.first, user.name.last, user.email, user.security.passwordHash)
        res.status(200).json(user)

    } catch (e) {
        throw new Error(e);
    }
});

// router.post('/login', (req, res) => {
//     try {
//         res.status(200).json({
//             timestamp: Date.now(),
//             code: 200,
//             msg: 'logged in'
//         })


//     } catch (e) {
//         throw new Error(e)
//     }
// })
router.post('/login', (req, res, next) => {
    console.log(`2-login handler  ${JSON.stringify(req.body)}`)

    passport.authenticate('local',
        (err, user) => {
            console.log(`3-passport authenticate cb ${JSON.stringify(user)}`)
            if (err) {
                return res.status(401).json({
                    timestamp: Date.now(),
                    msg: 'access denied username or password',
                    code: 401
                })

            }
            if (!user) {
                return res.status(401).json({
                    timestamp: Date.now(),
                    msg: 'unauthorized user',
                    code: 401
                })
            }
            req.logIn(user, () => {
                if (err) {
                    return next(err)
                }
                res.status(200).redirect('/support')
            })

        })(req, res, next)

}
);


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


export default router