import React from 'react'
import {Card, Button, Form} from "react-bootstrap";
const {tokenize} = require('excel-formula-tokenizer');
const {buildTree} = require('excel-formula-ast');

const parseFormula = (formula) => {
    let tokens = null, ast = null;

    try {
      tokens = tokenize(formula);
    } catch (e) {
      return {
        error: `Could not tokenise: ${e}`,
      };
    }

    try {
      ast = buildTree(tokens);
    } catch (e) {
      return {
        error: `Could not build tree: ${e}`,
      };
    }

    return {tokens, ast};
  }

function FormulaParser() {
  return (
    <Card style={{ width: '36rem' }}>
        <Card.Body>
            <Card.Title>Excel to LaTeX</Card.Title>
            <Form>
                <Form.Group className="mb-3" controlId="formulaForm.formulaInput">
                    <Form.Label>Formula</Form.Label>
                    <Form.Control type="text" placeholder="ex. (1/PI())) * SQRT(I5/D14)" />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e) => console.log(parseFormula("(1/2)*(SUM(C1,2)+4)"))}>Render</Button>
        </Card.Body>
    </Card>
  )
}

export default FormulaParser