document.addEventListener("DOMContentLoaded", () => {

    // cookies are only used here. No need to create a library
    const setCookie = (name, value, days = 7, path = '/') => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path + ';SameSite=Strict';
    }
      
    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=')
            return parts[0] === name ? decodeURIComponent(parts[1]) : r
        }, '')
    }
    
    const deleteCookie = (name, path) => {
        setCookie(name, '', -1, path)
    }

    const canShowNewsletter = getCookie('newsletter') !== 'closed';
    const bottomDrawer = document.getElementById("bottomDrawer");
    const closeButton = document.getElementById("closeButton");

    const openDrawer = () => {
        bottomDrawer.classList.remove("translate-y-0");
        bottomDrawer.classList.add("translate-y-full");
    }

    const closeDrawer = () => {
        bottomDrawer.classList.remove("translate-y-full");
        bottomDrawer.classList.add("translate-y-0");
    }

    closeButton.addEventListener("click", () => {
        setCookie('newsletter', "closed", 1);
        closeDrawer();
    });

    document.addEventListener("click", (event) => {
        if (
        !bottomDrawer.contains(event.target)
        ) {
            closeDrawer();
        }
    });

    window.onscroll = canShowNewsletter && function() {
        // document.body is window height because of the sticky footer
        // so we use header + main
        const pageHeight = document.getElementsByTagName("main")[0].offsetHeight + document.getElementsByTagName("header")[0].offsetHeight;

        if (window.innerHeight + Math.ceil(window.pageYOffset) + 300 >= pageHeight) {
            const canShowNewsletter = getCookie('newsletter') !== 'closed';
            canShowNewsletter && openDrawer();
        }
        if (window.innerHeight + Math.ceil(window.pageYOffset) + 300 <= pageHeight) {
            closeDrawer();
        }
    }

});