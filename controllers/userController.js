import express from "express";

export function renderIndexPage(req, res) {
	res.render("index");
}

export function renderSignupForm(req, res) {
	res.render("signup");
}
export function getUserForm(req, res, next) {}
