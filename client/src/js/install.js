// Logic for installing the PWA
// Await Install! button click on nav bar
const butInstall = document.getElementById('buttonInstall');

// Event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    window.deferredPrompt = event;
    butInstall.classList.toggle('hidden', false);
});

// Click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
        return;
    }
    promptEvent.prompt();
    window.deferredPrompt = null;
    butInstall.classList.toggle('hidden', true);
});

// Handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    window.deferredPrompt = null;
});
