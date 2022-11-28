import {
  Stack,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
 } from '@chakra-ui/react';

const copy = [
  {
    q: 'How do I use this service?',
    a: 'Work In Progress...',
  },
  {
    q: 'Will this host my experiment?',
    a: "No, you'll need to use a different service to make the experiment available online. The benefit of using this service is that you won't need to configure any of the backend/server components of an experiment, so you can use a provider like GitHub Pages to host the experiment for free. Link to tutorial on how to do this?",
  },
  {
    q: 'Will this store my data?',
    a: 'No. Pipe My Data will send your data directly to the OSF and will not store a copy of the data.',
  },
  {
    q: 'How much does this cost?',
    a: 'Pipe My Data is free to use.',
  },
  {
    q: 'Why is this service free?',
    a: "The expensive parts of hosting an experiment are providing storage and bandwidth for the experiment files and data. Fortunately there are providers who are willing to do both of these things for free. GitHub (and others) will host a website for free and the Open Science Framework will store data for free. Unfortunately these providers are not directly connected to each other, so that's what we are trying to solve. Pipe My Data is a very lightweight (i.e., cheap) service that makes it easy to link a hosting provider with a data storage provider.",
  },
  {
    q: 'How much does this service cost to run?',
    a: "We host Pipe My Data using Google's Firebase framework, so the cost of Pipe My Data depends on how much usage it gets. Currently our resource consumption is less than $1 per month. Once we have been up and running for a while we will post more information about how much it costs to run the service here. We have funding reserves in the Open Collective account for jsPsych development (link). Our goal is to provide transparent in formation about our costs and our available funds to run the service so you can determine whether we are likely to be able to keep the service running. We are grateful for donations to help keep the service running. You can donate here (link).",
  },
  {
    q: 'Who can see the data that I collect using this service?',
    a: 'Work In Progress...'
  },
  {
    q: 'What are the risks of using this service and how can I mitigate them?',
    a: `There are a few risks that you should be aware of before using Pipe My Data.

First, in order to use this service you must provide us with an OSF authorization token so that we can write data to your OSF account on your behalf. This key enables full write access, so if we suffer a data breach it would be possible for someone who got access to the token to make malicious changes to your OSF account. To mitigate this risk, you should create an OSF token that is just for this service so that you can revoke authorization when you are done using the service. The strongest security would be to use an active token only when you need to collect data through this service.
    
Second, this service does allow a technically savvy user to potentially write fake data to your OSF project. This is almost always a risk with online experiments because the data are usually recorded on the participant's computer before being sent to the server. It is possible for a malicious user to change or create the data before sending it to the service. It is also possible that a user could spam data to your OSF account or could send files that are not actually experiment data. We provide tools to mitigate these risks by allowing you to specify validation rules for the data that is sent and to rate limit the amount of data you are receiving.
    
Third, this service is not a commercial venture with a dedicated user support team. If something goes wrong, we may not be able to respond quickly. However, the code that runs this service is open source (link) and thoroughly tested. [something about benefits of open source for reliability?]. The service is hosted using the Google Cloud, so we get the benefit of Google's infrastructure to make sure the service keeps running.`
  }
];

export default function FAQ() {
  return (
    <Stack maxW={800} w='100%' my={10}>
      <Heading as="h1" my={4}>FAQ</Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {copy.map(({ q, a }) => (
          <AccordionItem key={q}>
            <h2>
              <AccordionButton>
                <Heading as="h2" size="md" my={2} flex='1' textAlign='left'>{q}</Heading>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} style={{ whiteSpace: 'pre-line' }}>{a}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  )
}