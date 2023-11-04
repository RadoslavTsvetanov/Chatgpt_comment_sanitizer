#!/usr/bin/env node
const { log } = require("console");
const fs = require("fs");

function get_file_content(filename) {
  try {
    log(filename);
    const data = fs.readFileSync(filename, "utf8");
    console.log("JavaScript file content:");
    return data;
  } catch (err) {
    // Handle errors by throwing an exception
    throw err;
  }
}

function check_for_comment(char, comment) {
  if (char == comment) {
    return true;
  }
  return false;
}

function write_new_data_to_file(filename, data) {
  try {
    fs.writeFileSync(filename, data, "utf8");
  } catch (e) {
    log(e);
  }
}

function return_new_line(string, start) {
  for (let i = start; i < string.length; i++) {
    if (string[i] === "\n") {
      return i;
    }
  }
  return string.length;
}

function redact_file(data) {
  let newData = "";
  for (let i = 0; i < data.length; i++) {
    if (
      (check_for_comment(data[i], "/") &&
        check_for_comment(data[i + 1], "/")) ||
      check_for_comment(data[i], "#")
    ) {
      const endOfLine = return_new_line(data, i);
      i = endOfLine;
    } else {
      newData += data[i];
    }
  }
  return newData;
}

function main() {
  if (process.argv.length == 2) {
    log("set file name");
    return;
  }
  if (process.argv.length == 3) {
    try {
      const filename = process.argv[2];
      const content = get_file_content(filename);
      const redactedContent = redact_file(content);
      write_new_data_to_file(filename, redactedContent);
      log("Redacted content:");
      log(redactedContent);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

main();
