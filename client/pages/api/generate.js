import { Configuration, OpenAIApi } from "openai";
const fs = require('fs');
var uuid = require("uuid");

const configuration = new Configuration({
    apiKey: process.env["openai_key"],
  });
const openai = new OpenAIApi(configuration);
var resultArray = [];
var image_url;
var initial_image_url;

async function generateArt(body) {
    resultArray = [];
    const response = await openai.createImage({
        prompt: body.desc,
        n: 1,
        size: "256x256",
    });
    initial_image_url = response.data.data[0].url; 
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    const body = req.body;
    await generateArt(body);
    res.status(200).json({path:initial_image_url})
}
  