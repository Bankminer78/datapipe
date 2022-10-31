import { customAlphabet } from "nanoid";
import AuthCheck from "../../components/AuthCheck";
import {
  doc,
  setDoc,
  getDoc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { Button, Stack, Heading, FormControl, FormLabel, Input, Spinner, InputGroup, InputLeftAddon } from "@chakra-ui/react";

export default function NewExperimentPage({}) {
  return (
    <AuthCheck>
      <NewExperimentForm />
    </AuthCheck>
  );
}

function NewExperimentForm(){
  const { user } = useContext(UserContext);

  const [data, loading, error] = useDocumentData(doc(db, "users", user.uid));

  return(<>
    {loading && <Spinner color="green.500" size={"xl"} />}
      {data && data.osfTokenValid && (
        <Stack>
          <Heading>Create a New Experiment</Heading>
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Input type="text" />
          </FormControl>
          <FormControl id="osf-repo">
            <FormLabel>Existing OSF Project</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://osf.io/</InputLeftAddon>
              <Input type="text" />
            </InputGroup>
          </FormControl>
          <FormControl id="osf-component-name">
            <FormLabel>New OSF Data Component Name</FormLabel>
            <Input type="text" />
          </FormControl>
          <Button onClick={handleCreateExperiment}>Create</Button>
        </Stack>
      )}
      {data && !data.osfTokenValid && (
        <div>
          <h1>Connect your OSF Account</h1>
          <p>
            Before you can create an experiment, you need to connect your OSF
            account.
          </p>
          <Link href="/admin/profile">
            <Button variant={"solid"} colorScheme={"green"} size={"md"}>
              Connect OSF Account
            </Button>
          </Link>
        </div>
  )}</>)
}

async function handleCreateExperiment() {
  const user = auth.currentUser;
  const title = document.querySelector("#title").value;
  const osfRepo = document.querySelector("#osf-repo").value;
  const osfComponentName = document.querySelector("#osf-component-name").value;

  //e.preventDefault();
  console.log("Creating experiment");
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    12
  );
  const id = nanoid();

  try {
    const userdoc = await getDoc(doc(db, `users/${user.uid}`));
    let osfToken = null;
    if (userdoc.exists()) {
      osfToken = userdoc.data().osfToken;
    }

    const osfResult = await fetch(
      `https://api.osf.io/v2/nodes/${osfRepo}/children/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${osfToken}`,
        },
        body: JSON.stringify({
          data: {
            type: "nodes",
            attributes: {
              title: osfComponentName,
              category: "data",
              description:
                "This node was autogenerated by OSF Relay (https://osf-relay.vercel.app/)",
            },
          },
        }),
      }
    );

    const nodeData = await osfResult.json();
    console.log(nodeData);

    const filesLink = nodeData.data.relationships.files.links.related.href;

    const filesResult = await fetch(filesLink, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${osfToken}`,
      },
    });

    const filesData = await filesResult.json();
    const uploadLink = filesData.data[0].links.upload;

    const batch = writeBatch(db);

    const experimentDoc = doc(db, "experiments", id);
    batch.set(experimentDoc, {
      title: title,
      osfRepo: nodeData.data.id,
      osfFilesLink: uploadLink,
      active: false,
      id: id,
      owner: user.uid,
    });

    const userDoc = doc(db, `users/${user.uid}`);
    batch.update(userDoc, {
      experiments: arrayUnion(id),
    });

    await batch.commit();
  } catch (error) {
    console.log(error);
  }
}
