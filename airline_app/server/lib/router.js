import express from "express";
import User from '../models/user.js'
import { client, stripe } from '../../index.js';
import passport from "passport";
import fetch from 'node-fetch'
import dotenv from 'dotenv';


dotenv.config();
console.log('API Key:', process.env.MAPS_API);
let router = express.Router();

router.get('/support', (req, res) => {
    if (req.isAuthenticated) {
        const locals = {
            title: 'sign up'
        };
        res.render('support', { locals })
    }
});
<<<<<<< HEAD
router.get('/', (req, res) => {
    const locals = {
        title: 'Travel buddy home'
    };
    res.render("index",);
=======
>>>>>>> main


router.get('/sign_in_form', (req, res) => {
<<<<<<< HEAD
    const locals = {
        title: 'sign up'
    };
    if (req.isAuthenticated()) {
        res.render('index')
    } else {
        res.render('sign_in_form', { locals })
    }
})
=======
    if (req.isAuthenticated) {
        const locals = {
            title: 'sign up'
        };
        res.render('index', { locals })
    } else {
        res.render('sign_in_form', { locals });
    }
});
>>>>>>> main

router.get('/sign_up_form', (req, res) => {
    const locals = {
        title: 'sign up'
    };
    res.render('sign_up_form', { locals });
});
router.get('/', (req, res) => {
    const locals = {
        title: 'sign up'
    };
    res.render('index', { locals });
});

router.get('/index', (req, res) => {
    const locals = {
        title: 'Sign Up',
    }
    res.render('index', locals);
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
        res.status(200).redirect('sign_in_form')

    } catch (e) {
        throw new Error(e);
    }
});

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
//

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

router.post('/search', (req, res, next) => {
    const city = req.body['search_city'];
    fetch(`https://en.wikipedia.org/wiki/${city}`)

    res.status(200).redirect(`https://en.wikipedia.org/wiki/${city}`)

});
router.post('/get_flights', async (req, res, next) => {
    console.log(`2-login handler  ${JSON.stringify(req.body)}`)
    try {
        const { leavingFrom, goingTo, departureDate, returnDate, quantity } = req.body;
        console.log(leavingFrom, goingTo, departureDate, returnDate, quantity)

        const origin_code = extract_airport_code(leavingFrom)
        const desination_code = extract_airport_code(goingTo)
        const travel_info = {
            departure: departureDate,
            return: returnDate,
            origin_code: origin_code,
            destination_code: desination_code
        }
        const flights = await client.query("SELECT * FROM FlightsWithAirportsAndFares WHERE origin_code = $1 AND destination_code =$2", [origin_code, desination_code])
        console.log(flights.rows)
        const l = flights.rows
        if (flights.rows.length > 0) {
            res.status(200).render('flights', { flight_info: l, travel_info: travel_info })
        }
    } catch (e) {
        throw new Error(e)
    }
})

router.post('/select_flight', (req, res) => {
    const flightDetails = {
        flightId: req.body.flight_id,
        basePrice: req.body.base_price,
        originName: req.body.origin_name,
        destinationName: req.body.destination_name,
        departureDateTime: req.body.departure_datetime,
        arrivalDateTime: req.body.arrival_datetime,
        fareClass: req.body.fare_class
    };

    // Here you can handle the flightDetails, like saving to a database or processing further
    console.log(flightDetails);
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Add flight to cart
    req.session.cart.push(flightDetails);

    // Optionally redirect to a page to view the cart or continue shopping
    res.redirect('view_cart');

});
router.get('/view_cart', (req, res) => {
    if (!req.session.cart) {
        res.send('Your cart is empty');
    } else {
        res.render('cart', {
            flights: req.session.cart
        });
    }
});
// Remove an item from the cart
router.post('/remove_from_cart', (req, res) => {
    const index = req.body.index;
    if (req.session.cart && index < req.session.cart.length) {
        req.session.cart.splice(index, 1);
    }
    res.redirect('/view_cart');
});



router.post('/proceed_to_checkout', async (req, res) => {
    const { stripeToken, totalPrice } = req.body;
    console.log(req.body)

    // Check for valid input
    if (!stripeToken || !totalPrice || totalPrice <= 0) {
        return res.status(400).render('error', { error: 'Invalid payment details provided.' });
    }

    try {
        // Always validate payment amounts server-side instead of relying on client-side data

        console.log(totalPrice)// Ensure this function calculates the expected total securely based on server-side data

        const charge = await stripe.charges.create({
            amount: totalPrice * 100, // convert dollars to cents
            currency: 'usd',
            description: 'Flight booking',
            source: stripeToken,
        });

        // Optionally, save or process the charge details in your database here

        res.status(200).render('checkout_confirmation'); // Pass any needed data to the success page
    } catch (error) {
        console.error('Stripe charge error:', error);
        res.status(500).render('error', { error: 'Failed to process payment. Please try again.' });
    }
});


function extract_airport_code(text) {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
}


export default router