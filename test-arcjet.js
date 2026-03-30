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
      remoteAddress: '127.0.0.1'
    }
  };
  try {
    const res = await aj.protect(req, { ip: "1.2.3.4" });
    console.log("Success:", res.isAllowed());
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
