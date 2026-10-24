(() => {
    "use strict";


    /* =========================================================
       DNL · MAIN
       Funciones compartidas por todo el portfolio.
       ========================================================= */


    const root =
        document.documentElement;


    const body =
        document.body;


    const $ = (
        selector,
        context = document
    ) =>
        context.querySelector(
            selector
        );


    const $$ = (
        selector,
        context = document
    ) =>
        [
            ...context.querySelectorAll(
                selector
            )
        ];


    const THEME_KEY =
        "dnl-theme";


    const systemDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );



    /* =========================================================
       01 · SAFE STORAGE
       ========================================================= */

    const safeGet =
        (
            key
        ) => {

            try {

                return localStorage.getItem(
                    key
                );

            }

            catch {

                return null;

            }

        };


    const safeSet =
        (
            key,
            value
        ) => {

            try {

                localStorage.setItem(
                    key,
                    value
                );

            }

            catch {

                /* El portfolio puede funcionar sin localStorage. */

            }

        };



    /* =========================================================
       02 · THEME
       ========================================================= */

    const getInitialTheme =
        () => {

            const saved =
                safeGet(
                    THEME_KEY
                );


            if (
                saved === "light" ||
                saved === "dark"
            ) {

                return saved;

            }


            return systemDark.matches
                ? "dark"
                : "light";

        };


    const applyTheme =
        (
            theme,
            persist = true
        ) => {

            root.dataset.theme =
                theme;


            root.style.colorScheme =
                theme;


            if (persist) {

                safeSet(
                    THEME_KEY,
                    theme
                );

            }


            const toggle =
                $(
                    "[data-theme-toggle]"
                );


            toggle?.setAttribute(

                "aria-label",

                theme === "dark"

                    ? "Activar modo claro"

                    : "Activar modo oscuro"

            );


            /*
             * Las animaciones/canvas específicos de cada página
             * pueden escuchar este evento.
             */

            window.dispatchEvent(

                new CustomEvent(
                    "dnl:themechange",
                    {
                        detail: {
                            theme
                        }
                    }
                )

            );

        };


    /*
     * Se aplica en cuanto carga main.js para recuperar el
     * modo utilizado en la página anterior.
     */

    applyTheme(
        getInitialTheme(),
        false
    );



    /* =========================================================
       03 · THEME BUTTON
       ========================================================= */

    const initThemeToggle =
        () => {

            const toggle =
                $(
                    "[data-theme-toggle]"
                );


            if (!toggle) {

                return;

            }


            toggle.addEventListener(

                "click",

                () => {

                    applyTheme(

                        root.dataset.theme ===
                            "dark"

                            ? "light"

                            : "dark"

                    );

                }

            );

        };



    /* =========================================================
       04 · MOBILE MENU
       ========================================================= */

    const initMenu =
        () => {

            const toggle =
                $(
                    "[data-menu-toggle]"
                );


            const navigation =
                $(
                    "[data-navigation]"
                );


            if (
                !toggle ||
                !navigation
            ) {

                return;

            }


            const setMenu =
                (
                    open
                ) => {

                    navigation.classList.toggle(
                        "is-open",
                        open
                    );


                    body.classList.toggle(
                        "menu-open",
                        open
                    );


                    toggle.setAttribute(
                        "aria-expanded",
                        String(open)
                    );


                    toggle.setAttribute(

                        "aria-label",

                        open
                            ? "Cerrar menú"
                            : "Abrir menú"

                    );

                };


            toggle.addEventListener(

                "click",

                () => {

                    setMenu(

                        !navigation.classList.contains(
                            "is-open"
                        )

                    );

                }

            );


            navigation.addEventListener(

                "click",

                (
                    event
                ) => {

                    if (
                        event.target.closest(
                            "a"
                        )
                    ) {

                        setMenu(
                            false
                        );

                    }

                }

            );


            document.addEventListener(

                "keydown",

                (
                    event
                ) => {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        setMenu(
                            false
                        );

                    }

                }

            );


            window.addEventListener(

                "resize",

                () => {

                    if (
                        window.innerWidth >
                        920
                    ) {

                        setMenu(
                            false
                        );

                    }

                }

            );

        };



    /* =========================================================
       05 · YEAR
       ========================================================= */

    const initYear =
        () => {

            const year =
                new Date()
                    .getFullYear();


            $$(
                "[data-current-year]"
            ).forEach(

                (
                    element
                ) => {

                    element.textContent =
                        year;

                }

            );

        };





    /* =========================================================
       06 · INIT
       ========================================================= */

    const init =
        () => {

            initThemeToggle();

            initMenu();

            initYear();


        };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(

            "DOMContentLoaded",

            init,

            {
                once: true
            }

        );

    }

    else {

        init();

    }

})();