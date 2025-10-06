import { EllipsisVertical, Paperclip, SendHorizontal } from "lucide-react";

export default function TemplatePreview({
  header = "none",
  imagePreview = null,
  documentName = "",
  getDocumentIcon = () => "",
  videoPreview = null,
  body = "",
  footer = "",
  quickReplyButtons = [],
  getButtonIcon = () => null,
}) {
  return (
    <div className="w-[350px] min-w-[350px] max-w-[450px] bg-transparent flex flex-col items-center">
      <div
        className="rounded-xl overflow-hidden w-full min-h-[500px] h-[600px] flex flex-col border border-gray-200 "
        style={{
          backgroundColor: "#ece5dd",
          backgroundImage: `url('/AnimalVector.svg')`,
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
          backgroundPosition: "center",
        }}
      >
        {/* Header */}
        <div className="bg-[#075e54] h-[76px] flex items-center px-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
          <div className="flex-1">
            <div className="text-white font-medium text-lg">Contact Name</div>
            <div className="text-green-100 text-base">online</div>
          </div>
          <div className="text-white">
            <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        {/* Message bubble */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="grow space-y-4 overflow-y-auto p-4">
            <div className="ml-auto max-w-[80%]">
              <div className="bg-[#dcf8c7] rounded-lg text-base text-gray-900 text-left shadow">
                {/* Media Preview inside message bubble */}
                {(header === "image" || header === "document" || header === "video") && (
                  <div className="p-2">
                    {header === "image" && imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    )}
                    {header === "image" && !imagePreview && (
                      <div className="flex justify-center items-center bg-gray-200 h-48 w-full text-gray-500 text-lg font-medium rounded-lg">
                        Image Preview
                      </div>
                    )}
                    {header === "document" && documentName && (
                      <div className="flex items-center gap-3 bg-gray-200 h-32 w-full rounded-lg px-8">
                        <img src={getDocumentIcon(documentName)} alt="Document" className="w-12 h-12 object-contain" />
                        <span className="text-lg text-gray-700 font-medium truncate">{documentName}</span>
                      </div>
                    )}
                    {header === "document" && !documentName && (
                      <div className="flex justify-center items-center bg-gray-200 h-32 w-full text-gray-500 text-lg font-medium rounded-lg">
                        Document Preview
                      </div>
                    )}
                    {header === "video" && videoPreview && (
                      <video src={videoPreview} controls className="min-h-40 max-h-80 w-full rounded-lg object-cover" />
                    )}
                    {header === "video" && !videoPreview && (
                      <div className="flex justify-center items-center bg-gray-200 h-32 min-w-[200px] w-full text-gray-500 text-lg font-medium rounded-lg">
                        Video Preview
                      </div>
                    )}
                  </div>
                )}
                {/* Preview message */}
                {body && (
                  <span
                    className={`block px-4 break-words whitespace-pre-wrap${
                      header === "image" || header === "document" || header === "video" ? " pt-1" : " pt-3"
                    }`}
                  >
                    {body}
                  </span>
                )}
                {footer && (
                  <span className="block text-sm text-gray-500 opacity-50 mt-1 px-4 text-left break-words whitespace-pre-wrap">
                    {footer}
                  </span>
                )}
                <span
                  className={`block text-xs text-gray-500 mt-1 px-4 pb-2 text-right${!body && !footer && header === "none" ? " pt-3" : ""}`}
                >
                  9:11 PM
                </span>
                {/* Quick Reply Buttons */}
                {quickReplyButtons.length > 0 && (
                  <div className="border-t border-t-[#c5e7b0]space-y-1">
                    {quickReplyButtons.map((btn, index) => (
                      <div
                        key={index}
                        className={
                          `flex justify-center items-center gap-2 text-sm px-2 py-3 text-center` +
                          (index !== 0 ? " border-t border-t-[#c5e7b0]" : "") +
                          " cursor-pointer hover:bg-[#BEE3A8]"
                        }
                      >
                        {getButtonIcon(btn.type)}
                        <span
                          className="truncate max-w-[120px] overflow-hidden whitespace-nowrap text-center font-medium text-lg"
                          style={{ color: "#075e54" }}
                        >
                          {btn.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Input bar fixed at bottom */}
          <div className="bg-[#f0f0f0] px-4 py-3 flex items-center gap-2 border-t mt-auto">
            <button type="button" className="p-0 bg-transparent text-gray-500 border-0 outline-none flex items-center justify-center">
              <Paperclip className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="bg-white rounded-full px-4 py-2 text-gray-500 text-md">Type a message</div>
            </div>
            <button type="button" className="p-0 bg-transparent text-gray-500 border-0 outline-none flex items-center justify-center">
              <SendHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
