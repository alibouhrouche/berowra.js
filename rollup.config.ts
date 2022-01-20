import { defineConfig } from 'rollup';
import rollupts from '@rollup/plugin-typescript';
import { normalize } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

export default defineConfig({
    plugins: [rollupts(),{
      name: 'fixup',
      buildEnd: function(){
        mkdirSync(normalize("./dist/cjs/"),{ recursive: true })
        mkdirSync(normalize("./dist/esm/"),{ recursive: true })
        writeFileSync(normalize("./dist/cjs/package.json"),JSON.stringify({"type": "commonjs"}))
        writeFileSync(normalize("./dist/esm/package.json"),JSON.stringify({"type": "module"}))
      }
    }],
    input: 'src/index.ts',
    output: [{
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },{
      file: 'dist/esm/index.js',
      format: 'esm',
    }],
});
