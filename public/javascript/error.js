// errorHandlers.js

/**
 * Function to display an error message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {number} status - HTTP status code.
 * @param {string} title - Error title.
 * @param {string} message - Error message.
 */
const showError = function(req, res, status, title, message) {
    res.status(status);
    res.render('error', {
        title: title,
        content: message
    });
};

module.exports = {
    showError
};
