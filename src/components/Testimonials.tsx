"use client";

import Reveal from "@/components/Reveal";

// Shared between /about and the home page strip. Strongest quote first.
const TESTIMONIALS = [
  {
    quote:
      "Maher is one of the best designers and overall people I have collaborated with, We need more people like him in this space. I had the pleasure of hiring Maher on multiple occasions for various tasks a few times and now for my own project too. He honestly became my go-to for design services.",
    name: "Grigory Yusufov",
    role: "Mindful Magic, Business Owner",
  },
  {
    quote:
      "This freelancer is great UX/UI expert and on top of that he was extremely helpful and patient even though this project took a long time (because of us, not his fault) and he was able to finish it with great quality and success, we definitely will hire him again and highly recommend him for these types of projects.",
    name: "Tamim Hamid",
    role: "Theradome, CEO",
  },
  {
    quote:
      "I had the pleasure of working with Maher on a UX/UI design project, and I must say that he is a talented and intuitive designer. From the very beginning, Maher was focused on understanding my user needs and desires, and he incorporated them seamlessly into the design process.",
    name: "Joey Dakwerk",
    role: "Phonic, Business Owner",
  },
  {
    quote:
      "Maher did a wonderful job. Everything went smoothly, communication was fluent, delivered on time and as expected. I highly recommend working with Maher",
    name: "Salim Boudi",
    role: "Iteration X, Business Owner",
  },
];

export default function Testimonials() {
  return (
    <section className="mt-16">
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Client</span>
          <span>Words</span>
        </span>
        <h2 className="col-[3/8] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/8] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          What clients say
        </h2>
      </Reveal>

      <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
        {TESTIMONIALS.map((t, idx) => (
          <Reveal key={t.name} delay={idx * 0.05}>
            <figure className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-12 max-sm:py-8 border-b border-white/10 items-start">
              <blockquote className="col-[3/9] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/9] font-medium text-[clamp(18px,1.4vw,24px)] max-sm:text-[16px] leading-[140%] tracking-[-0.03em] text-[#c5c5c5]">
                “{t.quote}”
              </blockquote>
              <figcaption className="col-[10/13] max-sm:col-[1/5] sm:col-[1/5] lg:col-[10/13] flex flex-col gap-1 max-sm:mt-3">
                <span className="font-medium text-base text-[#c5c5c5] tracking-[-0.03em]">
                  {t.name}
                </span>
                <span className="font-semibold text-xs tracking-[-0.03em] text-[rgba(197,197,197,0.62)] uppercase leading-[140%]">
                  {t.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
