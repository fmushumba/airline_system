let _ = {};

_.name = () => {
    const regex = /[-' A-Za-z0-9 ]+/;
    const constraints = {
        'presence': {
            allowEmpty: false
        },
        'type': 'string',
        'format': {
            'pattern': regex,
            'flags': '1',
            'message': ' Name must match the following pattern: ' + regex
        }
    }
    return constraints
}

_.email = () => {
    const constraints = {
        'presence': {
            allowEmpty: false,
        },
        'type': 'string',
        'email': true
    }
    return constraints

}
_.password = () => {
    const regex = /[\w\d\s!@*-:;"'.?\\/]+/;
    const constraints = {
        'presence': { 'allowEmpty': false },
        'type': 'string',
        'length': {
            'minimum': 6,
        },
        'format': {
            'pattern': regex,
            'flags': '1',
            'message': ' password must match the following pattern: ' + regex
        },

    }
    return constraints
}

export default _;