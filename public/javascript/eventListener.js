<script>
document.addEventListener('DOMContentLoaded', function () {
    // Listen for click events on the document
    document.addEventListener('click', function (event) {
        const clickedElement = event.target;
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        // Check if the navbar is expanded
        if (!navbarCollapse.classList.contains('show')) {
            return;
        }

        // Check if the click is inside the navbar
        if (navbarToggler.contains(clickedElement) || navbarCollapse.contains(clickedElement)) {
            return;
        }

        // Since the click is outside and the navbar is open, simulate a click on the navbar toggler to close it
        navbarToggler.click();
    })
});
</script>
