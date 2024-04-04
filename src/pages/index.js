import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message) => {
    const url = "/api/chat";
    const productRelatedKeywords = ["neb", "NEB", "geomx"]; // 예시 키워드
    const isProductRelated = productRelatedKeywords.some((keyword) =>
      message.includes(keyword)
    );

    setIsLoading(true);

    if (!isProductRelated) {
      // 제품과 관련 없는 질문에 대한 처리
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "bot",
          message:
            "저희는 NEB 제품에 대해서만 답변할 수 있어요. 제품에 대해 물어봐주세요!",
        },
      ]);
      setIsLoading(false);
    } else {
      // 제품과 관련된 질문에 대한 처리
      axios
        .post(url, {
          model: "gpt-3.5-turbo-0301",
          messages: [{ role: "user", content: message }],
        })
        .then((response) => {
          console.log(response);
          setChatLog((prevChatLog) => [
            ...prevChatLog,
            {
              type: "bot",
              message: response.data.choices[0].message.content,
            },
          ]);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <div className="container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-900">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
          Chat PKT
        </h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
            {chatLog.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.type === "user" ? "bg-purple-500" : "bg-gray-800"
                  } rounded-lg p-4 text-white max-w-sm`}
                >
                  {message.message}
                </div>
                {/* 메일 전송 버튼 추가 */}
                {message.type === "bot" && (
                  <button
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      const recipientEmail = "jwwoo@philekorea.co.kr"; // 여기에 수신자 이메일 주소를 입력하세요.
                      const mailSubject =
                        encodeURIComponent("NEB 제품 문의 답변");
                      const mailBody = encodeURIComponent(
                        `안녕하세요,\n\n아래와 같은 제품 및 서비스에 관심이 있습니다:\n\n"${message.message}"\n\n 알려주세요.`
                      );
                      window.location.href = `mailto:${recipientEmail}?subject=${mailSubject}&body=${mailBody}`;
                    }}
                  >
                    이메일로 보내기
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
            <input
              type="text"
              className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
