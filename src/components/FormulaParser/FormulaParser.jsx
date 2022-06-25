import React, {useState, useRef} from 'react'
import {Card, Button, Form, Toast, Stack} from "react-bootstrap";
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
const {tokenize} = require('excel-formula-tokenizer');
const {buildTree, visit} = require('excel-formula-ast');


function FormulaParser() {
  const [latexString, setLatexString] = useState("");
  const [errored, setErrored] = useState(false);
  const [formula, setFormula] = useState("");

  let nodes = [];
  const visitor = {
        enterFunction(functionNode) {
            console.log(`function is ${functionNode.name}`);
            switch(functionNode.name.toLowerCase()) {
                case "pi":
                    console.log(functionNode);
                    nodes.push("\\pi");
                    break;
                case "sqrt":
                    //console.log(functionNode);
                    nodes.push("\\sqrt{%1}")
                    break;
                default:
                    //if(functionNode.)
                    let p = "%1";
                    Array.from(Array(functionNode.arguments.length-1)).forEach((x, i) => {
                        p += `,%${i+2}`;
                    });
                    console.log("\\text{" + functionNode.name+"(" + p + ")}");
                    nodes.push("\\text{" + functionNode.name+"(" + p + ")}");
                    break;
            }
        },
        exitFunction(functionNode) {
            console.log('exiting')
            switch(functionNode.name.toLowerCase()) {
                case "pi":
                    break;
                default:
                    let vArr = [];
                    Array.from(Array(functionNode.arguments.length)).forEach((x, i) => {
                        vArr.push(nodes.pop());
                    });
                    vArr = vArr.reverse();
                    console.log(vArr);
                    let exp = nodes.pop();
                    Array.from(Array(functionNode.arguments.length)).forEach((x, i) => {
                        let s = `%${i+1}`;
                        let re = RegExp(s, 'g');
                        console.log(re)
                        console.log(vArr[i]);
                        console.log(exp);
                        exp = exp.replace(re, vArr[i]);
                    });
                    nodes.push(exp);
                    break;
            }
        },
        enterNumber(numberNode) {
            console.log(`number is ${numberNode.value}`)
            nodes.push(numberNode.value);
        },  
        enterBinaryExpression(binExpNode) {
            console.log(`exp is ${binExpNode.operator}`)
            if(binExpNode.operator === "/") {
                nodes.push("\\dfrac{%1}{%2}");
            } else {
                nodes.push("%1" + binExpNode.operator + "%2");
            }
        },
        exitBinaryExpression(binExpNode) {
            console.log(`leaving ${binExpNode}`);
            let v2 = nodes.pop();
            let v1 = nodes.pop();
            let exp = nodes.pop();
            exp = exp.replace(/%1/g, v1);
            exp = exp.replace(/%2/g, v2);
            nodes.push(exp);
        },
        enterCell(cellNode) {
            console.log(`cell is ${cellNode.key}`)
            nodes.push("\\text{" + cellNode.key + "}");
        },
        enterCellRange(cellRangeNode) {
            console.log(`cell is ${cellRangeNode.left.key}-${cellRangeNode.right.key}`)
            nodes.push("%1:%2");
        },
        exitCellRange(cellRangeNode) {
            console.log(`exiting range`)
            let v2 = nodes.pop();
            let v1 = nodes.pop();
            let exp = nodes.pop();
            exp = exp.replace(/%1/g, v1);
            exp = exp.replace(/%2/g, v2);
            nodes.push(exp);
        },
    };

    const parseFormula = (formula) => {
        let tokens = null, ast = null;

        try {
        tokens = tokenize(formula);
        } catch (e) {
            setErrored(true);
        }

        try {
        ast = buildTree(tokens);
        } catch (e) {
            setErrored(true);
        }

        console.log(ast);

        visit(ast, visitor);
        console.log("$" + nodes.toString() + "$");
        setLatexString("$" + nodes.toString() + "$");

    }
  return (
    <div>
    <Toast show={errored} onClose={() => setErrored(false)}>
        <Toast.Header>
            <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Either I fucked up or your formula is invalid. You take a guess which one it is.</Toast.Body>
    </Toast>
    <Card style={{ width: '36rem' }}>
        <Card.Body>
            <Card.Title>Excel to LaTeX</Card.Title>
            <Form>
                <Form.Group className="mb-3" controlId="formulaForm.formulaInput">
                    <Form.Label>Formula</Form.Label>
                    <Form.Control as='input' type="text" placeholder="ex. (1/PI()) * SQRT(I5/D14)" onChange={e => setFormula(e.target.value)}/>
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e) => {
                console.log(formula);
                parseFormula(formula);
                }}>Render</Button>
        </Card.Body>
        <Latex>{latexString}</Latex>
        <br/>
    </Card>
    </div>
  )
}

export default FormulaParser