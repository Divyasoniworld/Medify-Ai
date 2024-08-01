import { Html, Head, Main, NextScript } from "next/document";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

export default function Document({ children }) {

  "Paracetamol, also known as acetaminophen, is a common over-the-counter pain reliever and fever reducer. \n\nHere's a breakdown of its uses:\n\n* **Pain Relief:** It's effective for mild to moderate pain, such as:\n    * Headaches\n    * Muscle aches\n    * Backaches\n    * Toothaches\n    * Period pain\n    * Pain from the common cold or flu\n\n* **Fever Reduction:** It helps lower body temperature when you have a fever.\n\n**Important Things to Know:**\n\n* **Dosage:** Always follow the instructions on the label or as prescribed by your doctor.\n* **Overdose:** Taking too much paracetamol can be dangerous. Be careful not to exceed the recommended dosage.\n* **Interactions:**  Paracetamol can interact with other medications. Tell your doctor about all the medications you're taking before taking paracetamol.\n* **Liver Damage:**  Long-term or excessive use of paracetamol can damage the liver. \n\n**Always consult your doctor or pharmacist if you have any questions about paracetamol or any other medication.** They can provide personalized advice and ensure you're using it safely. \n"

  return (
    <Html lang="en" suppressHydrationWarning >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <meta property="og:title" content="Medify AI" />
        <meta property="og:description" content="Know your meds, simplify your health" />
        <meta property="og:image" content="https://ik.imagekit.io/medifyai/appImages/appImage.png" />
        <link rel="icon" type="image/png" href="https://ik.imagekit.io/medifyai/appImages/favicon.png"></link>
        <title>Medify AI</title>
      </Head>
      <body
        className={cn(
          " bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme=""
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
