import Image from 'next/image';
import Head from 'next/head';
import * as React from 'react';
import toast, { Toaster } from 'react-hot-toast';

function ContentToCopy() {
  return (
    <div className="prose">
      <h2>
        Here is an example image and text to copy &amp; paste{' '}
        <span role="img" aria-label="doggo">
          🐕
        </span>
      </h2>
      <div className="flex flex-col sm:flex-row">
        <p>
          Doggo ipsum stop it fren length boy. Many pats very jealous pupper heckin angery woofer
          ruff bork smol blop porgo, aqua doggo long bois doge tungg floofs. Lotsa pats aqua doggo
          long woofer pupper vvv, much ruin diet ruff. Blop borkf bork fat boi, long woofer.
        </p>
        <div className="flex-none">
          <Image
            className="rounded-md"
            src="/sweet.jpg"
            alt="sweet shiba inu with glasses in front of a computer"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message, link }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">{message}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            {link && (
              <a
                href={link}
                className="whitespace-nowrap font-medium text-red-700 hover:text-red-600">
                Details <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyBoard() {
  return (
    <>
      <div className="bg-indigo-200 overflow-hidden shadow shadow-indigo rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-indigo-900 text-xl font-bold">
            Paste text or an image here with CTRL+V or CMD+V
          </h1>
        </div>
      </div>
      <div className="space-y-4 prose">
        <p>
          A simple Clipboard Manager demo app to demonstrate the{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold text-indigo-900 underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard">
            Clipboard API
          </a>{' '}
          which is built into the browser. At the time of writing this only works properly in Chrome
          and Safari. See{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold text-indigo-900 underline"
            href="https://caniuse.com/clipboard">
            caniuse.com
          </a>
        </p>
        <p>
          Firefox supports the Clipboard API too, but unfortionatly it does not recognise the
          `clipboard-read` permission. See the Note on{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold text-indigo-900 underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read">
            MDN
          </a>{' '}
          documentation.
        </p>

        <p>
          Safari does not support the{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold text-indigo-900 underline"
            href="https://caniuse.com/permissions-api">
            Permissions API
          </a>
          , but without using the Permissions API it works (sort of).
        </p>
      </div>
    </>
  );
}

async function copyToClipboard(type, value) {
  try {
    switch (type) {
      case 'text/plain': {
        await navigator.clipboard.write([
          new ClipboardItem({
            [type]: new Blob([value], { type })
          })
        ]);
        break;
      }
      case 'image/png': {
        const result = await fetch(value);
        const blob = await result.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [type]: blob
          })
        ]);
      }
    }
    toast.success('Copied succesfully');
  } catch (err) {
    console.error(err.name, err.message);
    toast.error('Could not copy :(');
  }
}

function CopyButton({ children, onClick }) {
  return (
    <button
      className="focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 ring-inset group relative bg-white overflow-hidden shadow rounded-md hover:bg-gray-100 transition-all duration-300"
      onClick={onClick}>
      <div className="shadow-md group-hover:translate-y-0 translate-y-full group-hover:opacity-100 transition-all duration-300 opacity-0 font-bold absolute bg-indigo-200 text-indigo-900 py-2 w-full bottom-0 transform left-0">
        Click to Copy me :)
      </div>
      <div className="px-4 py-4 sm:px-6">{children}</div>
    </button>
  );
}

function ListItem({ type, value }) {
  switch (type) {
    case 'image/png':
      return (
        <li>
          <CopyButton onClick={() => copyToClipboard(type, value)}>
            <img src={value} alt={'alt missing'} />
          </CopyButton>
        </li>
      );
    case 'text/plain':
      return (
        <li>
          <CopyButton onClick={() => copyToClipboard(type, value)}>{value}</CopyButton>
        </li>
      );
  }
}

export default function Home() {
  const [pastes, setPastes] = React.useState(null);
  const [error, setError] = React.useState(null);

  function addToPastes(newPaste) {
    setPastes((prev) => {
      if (!prev) {
        return [newPaste];
      }

      return [newPaste, ...prev];
    });
  }

  function handleClipboard() {
    navigator.clipboard
      .read()
      .then(async (clipboardItems) => {
        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            const blob = await clipboardItem.getType(type);
            switch (type) {
              case 'text/plain': {
                const text = await blob.text();
                if (text) {
                  addToPastes({ type, value: text });
                }
                break;
              }
              case 'image/png':
                addToPastes({ type, value: URL.createObjectURL(blob) });
                break;
            }
          }
        }
      })
      .catch((error) => {
        setError({ message: error.message, link: null });
      });
  }

  React.useEffect(() => {
    if (!navigator.clipboard) {
      setError({
        message: 'Clipboard API not available',
        link: 'https://caniuse.com/clipboard'
      });
      return;
    }

    function handlePasteEvent(event) {
      handleClipboard();
      event.preventDefault();
    }

    document.addEventListener('paste', handlePasteEvent);

    return () => {
      document.removeEventListener('paste', handlePasteEvent);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Head>
        <title>Clipboard API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="app" className="flex-1">
        <a
          href="https://github.com/phiilu/clipboard-browser-api-demo-nextjs"
          className="bg-gray-900 hover:bg-gray-800 rounded-bl absolute top-0 right-0 w-12 h-12 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
              transform="scale(64)"
              fill="currentColor"
            />
          </svg>
        </a>
        <div className="md:max-w-2xl md:mx-auto p-4 md:p-12 sm:px-6 lg:px-8 space-y-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                Clipboard API
              </h2>
            </div>
          </div>

          <div id="content" className="space-y-8">
            {error && <ErrorMessage message={error.message} link={error.link} />}
            <ContentToCopy />
            {!pastes && <EmptyBoard />}
            {pastes && (
              <ul className="space-y-3">
                {pastes.map((paste, i) => {
                  return <ListItem key={i} type={paste.type} value={paste.value} />;
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Toaster position="top-right" />

      <footer className="bg-gray-100 text-gray-900 text-center py-4">
        Made by{' '}
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500"
          href="https://twitter.com/phiilu">
          @phiilu
        </a>
      </footer>
    </div>
  );
}
