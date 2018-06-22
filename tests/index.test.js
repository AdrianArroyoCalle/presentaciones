import test from "ava";
import request from "supertest";
import {setup} from "../main";

function sum(a,b){
    return a+b;
}

test("Test example: Sum",t => {
    t.is(sum(1,2),3);
});

test("controllers:static:main.css", async t => {
    let res = await request(setup())
        .get("/static/main.css")
        .send();
    t.is(res.status,200);
    t.true(res.header["content-type"].startsWith("text/css"));
});

test("controllers:index", async t => {
    let res = await request(setup())
        .get("/")
        .send();
    t.is(res.status,200);
    t.true(res.header["content-type"].startsWith("text/html"));
});