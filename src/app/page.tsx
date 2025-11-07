import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";
import {
  ArrowRight,
  Brain,
  Download,
  FileText,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main>
      <div className="min-h-screen bg-cyan-100">
        {/* Navbar */}
        <nav className="border-b-4 border-black bg-white p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Card className="bg-primary flex size-12 rotate-3 items-center justify-center border-4 shadow-none hover:shadow-none">
                <Text as={"h3"}>C</Text>
              </Card>
              <Text as={"h4"}>ClarifAI</Text>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <TextLink
                href={PageRoutes.LOGIN}
                className="font-bold decoration-4 hover:underline"
              >
                Login
              </TextLink>
              <Link href={PageRoutes.SIGNUP}>
                <Button variant="default" className="text-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <section className="mb-12 flex flex-col items-center text-center">
            <div className="border-foreground mb-6 flex -rotate-1 flex-row items-center justify-center gap-2 border-4 bg-pink-400 px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="fill-primary size-6" />
              <span className="font-bold">AI-POWERED LEARNING</span>
            </div>

            <h1 className="mb-6 text-5xl leading-tight font-black md:text-7xl">
              STUDY SMARTER,
              <br />
              <span className="border-foreground bg-primary inline-block -rotate-1 border-4 px-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                NOT HARDER
              </span>
            </h1>

            <Text
              as={"p"}
              className="mx-auto mb-10 max-w-2xl text-xl font-bold md:text-2xl"
            >
              Upload your lessons. Get smart questions. Receive AI feedback.
              <span className="text-blue-600"> Actually understand</span> what
              you&lsquo;re learning.
            </Text>

            <Link href={PageRoutes.SIGNUP}>
              <Button variant="default" className="space-x-2 text-lg">
                <span>START LEARNING NOW</span>
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </section>

          {/* Features */}
          <section id="features" className="mb-16">
            <Text
              as={"h2"}
              className="mb-12 text-center text-4xl font-black md:text-5xl"
            >
              POWERFUL FEATURES
            </Text>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Upload />,
                  title: "UPLOAD & ANALYZE",
                  desc: "Drop your PDF and watch AI work its magic",
                  bg: "bg-yellow-400",
                },
                {
                  icon: <Brain />,
                  title: "SMART QUESTIONS",
                  desc: "Get questions that actually test understanding",
                  bg: "bg-pink-400",
                },
                {
                  icon: <Sparkles />,
                  title: "AI FEEDBACK",
                  desc: "Personalized insights to level up your knowledge",
                  bg: "bg-blue-400",
                },
                {
                  icon: <TrendingUp />,
                  title: "TRACK PROGRESS",
                  desc: "See your improvement in real-time",
                  bg: "bg-green-400",
                },
                {
                  icon: <FileText />,
                  title: "REFLECT & GROW",
                  desc: "Write reflections to cement your learning",
                  bg: "bg-purple-400",
                },
                {
                  icon: <Download />,
                  title: "EXPORT & SAVE",
                  desc: "Keep all your sessions for future review",
                  bg: "bg-orange-400",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className={`${feature.bg} p-8 transition-transform hover:-rotate-1`}
                >
                  {feature.icon}
                  <h3 className="mb-3 text-2xl font-black">{feature.title}</h3>
                  <p className="text-lg font-bold">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section
            id="how"
            className="border-4 border-black bg-black p-12 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)]"
          >
            <h2 className="mb-12 text-center text-4xl font-black md:text-5xl">
              HOW IT WORKS
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "UPLOAD",
                  desc: "Drop your lesson PDF",
                  bg: "bg-yellow-400",
                },
                {
                  step: "02",
                  title: "GENERATE",
                  desc: "AI creates questions",
                  bg: "bg-pink-400",
                },
                {
                  step: "03",
                  title: "ANSWER",
                  desc: "Write your responses",
                  bg: "bg-blue-400",
                },
                {
                  step: "04",
                  title: "LEARN",
                  desc: "Get smart feedback",
                  bg: "bg-green-400",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`${item.bg} mx-auto mb-4 flex h-20 w-20 rotate-3 items-center justify-center border-4 border-white text-3xl font-black text-black`}
                  >
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-2xl font-black">{item.title}</h3>
                  <p className="text-lg font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t-4 border-black bg-white p-6 text-center">
          <Text as={"p"}>© {currentYear} ClarifAI. All rights reserved.</Text>
        </footer>
      </div>
    </main>
  );
}
