import Link from "next/link"
import { FaGithub, FaTwitter } from "react-icons/fa"

export default function Header() {
  return (
    <>
      <div className="flex justify-between items-center p-7">
        <Link
          href="https://weavedb.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <svg
              width="48"
              height="29"
              viewBox="0 0 63 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M46.9565 5.0801L42.0443 10.0458L47.6338 15.6344L53.2232 21.223L58.1117 16.3356C60.8003 13.6476 63 11.3949 63 11.3296C63 11.2642 60.4954 8.71406 57.4344 5.66257L51.8688 0.114502L46.9565 5.0801ZM4.90823 10.0632L0 14.981L14.3981 29.4331L28.7961 43.8854L33.7655 38.915L38.7347 33.9446L24.3348 19.5451C16.4149 11.6253 9.90822 5.14547 9.87559 5.14547C9.84296 5.14547 7.60764 7.35841 4.90823 10.0632ZM28.576 10.0632L23.6597 14.981L32.5129 23.9129L41.3659 32.8447L46.3525 27.8592L51.3389 22.8738L42.4753 14.0096C37.6004 9.13434 33.5849 5.14547 33.552 5.14547C33.5192 5.14547 31.28 7.35841 28.576 10.0632Z"
                fill="currentColor"
              />
            </svg>

            <span style={{ marginLeft: ".4em", fontWeight: 800 }}>WeaveDB</span>
          </div>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <a
            href="https://twitter.com/weave_db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={24} style={{ color: "white" }} />
          </a>
          <a
            href="https://github.com/drumfeet/weavedb-dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub
              size={24}
              style={{ color: "white", marginLeft: ".8em" }}
            />
          </a>
        </div>
      </div>
    </>
  )
}
