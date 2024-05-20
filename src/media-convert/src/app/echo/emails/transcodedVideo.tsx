import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface VercelInviteUserEmailProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://mediaconvert.vercel.app`
  : 'http://localhost:4000';

export const TranscodedVideo = ({ firstName, lastName }: any) => {
  const previewText = `It is Time`;

  return (
    <Html>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/Novaria.png`}
                width="200"
                height="150"
                alt="Novaria"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              It is time
            </Heading>
            <Section className="flex flex-row ">
              <Text className="text-black text-[14px] leading-[24px]">
                Hello {lastName},
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                We will be conducting a Novarian DDOS on Vinotifica.
              </Text>
              <Text className="text-black text-xl leading-[24px] flex flex-col">
                LET THEM KNOW OUR CROISSANT FILLED FURY!!!
              </Text>

            </Section>
            <Button
                href={`${baseUrl}/event`}
                className={"bg-blue mx-auto rounded-lg text-white mt-4"}
            >
              <Img
                  src={`${baseUrl}/CroissantArtillery.gif`}
                  width="200"
                  height="150"
                  alt="Anonympia"
                  className="my-0 mx-auto"
              />
            </Button>
            <Text className="text-black text-[14px] leading-[24px]"> Or go to the site directly <Link href={`${baseUrl}/event`} className={"text-blue"} > Here</Link> </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{' '}
              <span className="text-black">
                EVERYONE
              </span>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TranscodedVideo;

export function renderTranscodedVideo(inputs: any) {
  return render(<TranscodedVideo {...inputs} />);
}
