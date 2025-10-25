#!/usr/bin/env node
require('dotenv').config();
require('ts-node').register({ transpileOnly: true });
require('./init-database.ts');
