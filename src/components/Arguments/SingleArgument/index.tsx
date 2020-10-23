import React from "react";
import { Argument } from "components/Arguments/types";
import { Container, Input, Label, Type, Error } from "./styles";

type SingleArgumentProps = {
  argument: Argument,
  error: String,
  onChange: (name: String, value:any) => void
}

const SingleArgument: React.FC<SingleArgumentProps> = ({ argument, error, onChange }) => {
  const {name, type} = argument
  return (
    <Container>
      <Label>
        {name}
        <Type>{type}</Type>
      </Label>
      <Input onChange={(event)=>{
        const {value} = event.target
        onChange(name,value)
      }}/>
      {error && <Error>{error}</Error>}
    </Container>
  )
}

export default SingleArgument