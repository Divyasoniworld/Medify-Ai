/**
 * v0 by Vercel.
 * @see https://v0.dev/t/RYLW90HrvZI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ChatScreen() {
  return (
   
      <div className="flex-1  overflow-auto p-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Hi ChatGPT, can you explain how airplane turbulence works?</p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
              <p className="text-sm">
                Absolutely! Airplane turbulence happens when the plane encounters pockets of air that are moving
                differently. It's like driving on a bumpy road - the plane can feel like it's bouncing or shaking a bit.
                It's completely normal and usually not dangerous at all.
              </p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">
                That makes sense, thanks for the explanation! Is there anything I can do to make turbulence less
                uncomfortable?
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
              <p className="text-sm">Here are a few tips to help make turbulence less uncomfortable:</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Stay seated with your seatbelt fastened</li>
                <li>Avoid getting up during turbulence</li>
                <li>Take slow, deep breaths to stay calm</li>
                <li>Bring noise-cancelling headphones to block out the noise</li>
                <li>Bring a book or magazine to distract yourself</li>
              </ul>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Hi ChatGPT, can you explain how airplane turbulence works?</p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
              <p className="text-sm">
                Absolutely! Airplane turbulence happens when the plane encounters pockets of air that are moving
                differently. It's like driving on a bumpy road - the plane can feel like it's bouncing or shaking a bit.
                It's completely normal and usually not dangerous at all.
              </p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">
                That makes sense, thanks for the explanation! Is there anything I can do to make turbulence less
                uncomfortable?
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
              <p className="text-sm">Here are a few tips to help make turbulence less uncomfortable:</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Stay seated with your seatbelt fastened</li>
                <li>Avoid getting up during turbulence</li>
                <li>Take slow, deep breaths to stay calm</li>
                <li>Bring noise-cancelling headphones to block out the noise</li>
                <li>Bring a book or magazine to distract yourself</li>
              </ul>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
  )
}
