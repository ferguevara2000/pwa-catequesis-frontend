function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const vapidKey = "BIiF29te7oMuYrMajQS6vztjRsrEFWSpWANnF0lqmVKsNSIXuVgY3m_y13Q-rDcypkcJikpFj46M0ijGmKIXhqc";

export async function suscribirAPush() {
  console.log("suscrbirse a push");
  if ("serviceWorker" in navigator && "PushManager" in window) {
    // 1. Solicita permiso si aún no está concedido
    if (Notification.permission !== "granted") {
      const permiso = await Notification.requestPermission();
      console.log("Permiso de notificaciones:", permiso);
      if (permiso !== "granted") {
        console.warn("Permiso de notificaciones denegado");
        return
      }
    }

    const reg = await navigator.serviceWorker.ready;
    console.log("Service Worker listo:", reg);
    try {
      let subscription = await reg.pushManager.getSubscription();
      console.log(subscription, "Suscripción");
      if (!subscription) {
        console.log("No hay suscripción, creando una nueva...");
        const keyUint8 = urlBase64ToUint8Array(vapidKey);
        console.log('clave VAPID en Uint8Array:', keyUint8);
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
        console.log(subscription, "Suscripción creada");
      } else {
        console.log("Ya existe una suscripción:", subscription);
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`, {
        method: "POST",
        body: JSON.stringify({ subscription }),
        headers: { "Content-Type": "application/json" }
      });

      return subscription;
    } catch (err) {
      console.error("Error al suscribirse a Push:", err);
    }
  } else {
    throw new Error("Push no soportado");
  }
}