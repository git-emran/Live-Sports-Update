import arcjet, { fixedWindow } from "@arcjet/node";

const aj = arcjet({
  key: "test-key",
  rules: [
    fixedWindow({
      mode: "DRY_RUN",
      characteristics: ["ip.src"],
      max: 10,
      window: "60s"
    })
  ]
});

async function main() {
  const req = {
    method: 'GET',
    url: '/',
    headers: {
      'x-real-ip': '1.2.3.4'
    },
    socket: {
      remoteAddress: '2.3.4.5'
    }
  };
  try {
    const res = await aj.protect(req);
    console.log("Success (no IP passed):", res.isAllowed());
    console.log("IP recorded:", res.ip);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
