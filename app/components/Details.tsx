import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/Accordion"; // Import the ShadCN accordion component
import ScoreBadge from "./ScoreBadge";
import { cn } from "~/lib/utils";

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <>
      {tips.map((tip, index) => (
        <div
          key={index + tip.tip}
          className={cn(
            "flex flex-col gap-1 rounded-xl p-4 border",
            tip.type === "good"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-orange-50 border-orange-100 text-orange-500"
          )}
        >
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-semibold leading-snug">{tip.tip}</p>
          </div>
          <p className="text-[14px] text-neutral-800">{tip.explanation}</p>
        </div>
      ))}
    </>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    // Accordion sample from ShadCN's official website
    <Accordion
      type="single"
      collapsible
      className="w-full mt-8 pt-6"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-row items-center justify-between w-full">
            <p>CONTENT</p>
            <ScoreBadge score={feedback.content.score} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <CategoryContent tips={feedback.content.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex flex-row items-center justify-between w-full">
            <p>SKILLS</p>
            <ScoreBadge score={feedback.skills.score} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <CategoryContent tips={feedback.skills.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          <div className="flex flex-row items-center justify-between w-full">
            <p>STRUCTURE</p>
            <ScoreBadge score={feedback.structure.score} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <CategoryContent tips={feedback.structure.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>
          <div className="flex flex-row items-center justify-between w-full">
            <p>TONE & STYLE</p>
            <ScoreBadge score={feedback.toneAndStyle.score} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <CategoryContent tips={feedback.toneAndStyle.tips} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
