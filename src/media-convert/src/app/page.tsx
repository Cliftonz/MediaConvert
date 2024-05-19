import Link from "next/link"
import {ArrowRight, VideoIcon} from "lucide-react";


export default async function Component() {

  const signinHref= "/app/signin"

  return (
      <div className="flex flex-col min-h-[100dvh]">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <VideoIcon className="h-6 w-6" />
            <ArrowRight className="h-6 w-6"/>
            <VideoIcon className="h-6 w-6" />
            <span className="sr-only">Video Converter</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href={signinHref}
            >
              Convert Now
            </Link>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Convert Videos with Ease
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Our powerful video conversion tool supports a wide range of input and output formats, allowing you
                    to
                    quickly and effortlessly convert your videos without compromising quality.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link
                      className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      href={signinHref}
                  >
                    Convert Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/*<section className="w-full py-12 md:py-24 lg:py-32 ">*/}
          {/*  <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">*/}
          {/*    <div className="space-y-3">*/}
          {/*      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>*/}
          {/*      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">*/}
          {/*        See how our video conversion tool has helped our users.*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">*/}
          {/*      <div*/}
          {/*          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">*/}
          {/*        <h3 className="text-2xl font-bold">{props.projects}+</h3>*/}
          {/*        <p className="text-gray-500 dark:text-gray-400">Projects Converted</p>*/}
          {/*      </div>*/}
          {/*      <div*/}
          {/*          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">*/}
          {/*        <h3 className="text-2xl font-bold">{props.hours}+</h3>*/}
          {/*        <p className="text-gray-500 dark:text-gray-400">Hours Saved</p>*/}
          {/*      </div>*/}
          {/*      <div*/}
          {/*          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">*/}
          {/*        <h3 className="text-2xl font-bold">{props.files}+</h3>*/}
          {/*        <p className="text-gray-500 dark:text-gray-400">Files Handled</p>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</section>*/}
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Video Converter. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
  )
}

