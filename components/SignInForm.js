import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Text,
  Link as ChakraLink,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { ERROR, getError } from "../lib/utils";

export default function SignInForm({ routeAfterSignIn }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      router.push(routeAfterSignIn);
    } catch(error) {
      setIsSubmitting(false);
      const { code } = error;
      if (code == ERROR.PASSWORD_WRONG) {
        setErrorPassword(getError(code));
      } else {
        setErrorEmail(getError(code));
      }
      console.log("Sign in failed");
      console.log(error);
    }  
  }

  return(
    <Card w={360} bgColor="white">
      <CardHeader>
        <Heading size='lg'>Sign In</Heading>
      </CardHeader>
      <CardBody>
        <Stack>
          <FormControl isInvalid={errorEmail}>
            <FormLabel>Email</FormLabel>
            <Input type="email" onChange={e => { setEmail(e.target.value); setErrorEmail('') }} />
            <FormErrorMessage>{errorEmail}</FormErrorMessage>
          </FormControl>
          <FormControl pb={4} isInvalid={errorPassword}>
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={e => { setPassword(e.target.value); setErrorPassword('') }} />
            <FormErrorMessage>{errorPassword}</FormErrorMessage>
          </FormControl>
          <Text>
            <Link href="/reset-password" passHref><ChakraLink>Forgot password?</ChakraLink></Link>
          </Text>
          <Button
            colorScheme={"brandBlue"}
            isLoading={isSubmitting}
            onClick={onSubmit}>
            Sign In
          </Button>
          <Text pt={4}>Need an account? <Link href="/signup" passHref><ChakraLink>Sign Up!</ChakraLink></Link></Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
