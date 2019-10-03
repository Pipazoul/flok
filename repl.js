#!/usr/bin/env node
const program = require("commander");
const { spawn } = require("child_process");
const PubSubClient = require("./lib/pubsub-client");

program
  .version("0.1.0")
  .option("-t, --target [NAME]", "Use the specified name as target", "default")
  .option("--secure", "Use secure connection (wss://)", false)
  .option("-H, --host [HOST]", "Evaluation WebSockets server host", "localhost")
  .option("-P, --port [PORT]", "Evaluation WebSockets server port", 3000)
  .option("--path [PATH]", "Evaluation WebSockets server path", "/pubsub")
  .parse(process.argv);

const cmd = program.args[0];
const cmdArgs = program.args.slice(1);

const wsProtocol = program.secure ? "wss" : "ws";
const wsUrl = `${wsProtocol}://${program.host}:${program.port}${program.path}`;

console.log(`Target: ${program.target}`);
console.log(`PubSub server: ${wsUrl}`);
console.log(`Spawn: ${JSON.stringify(program.args)}`);

const pubSub = new PubSubClient(wsUrl, {
  connect: true,
  reconnect: true
});

const { target } = program;

const buffers = { stdout: "", stderr: "" };
let lastUserName = null;

const handleData = (data, type) => {
  // process.stderr.write(data.toString());

  const newBuffer = buffers[type].concat(data.toString());
  const lines = newBuffer.split("\n");

  buffers[type] = lines.pop();

  if (lines.length > 0) {
    pubSub.publish(`target:${target}:out`, { target, type, body: lines });
    if (lastUserName) {
      pubSub.publish(`user:${lastUserName}`, { target, type, body: lines });
    }
  }
};

// Spawn process
const repl = spawn(cmd, cmdArgs);

// Handle stdout and stderr
repl.stdout.on("data", data => {
  handleData(data, "stdout");
});

repl.stderr.on("data", data => {
  handleData(data, "stderr");
});

repl.on("close", code => {
  console.log(`child process exited with code ${code}`);
});

// Subscribe to pub sub
pubSub.subscribe(`target:${target}:in`, message => {
  const { body, userName } = message;
  const text = `${body.trim()}\n`;

  repl.stdin.write(text);
  // process.stdout.write(text);

  lastUserName = userName;
});
