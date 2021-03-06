import React, { useState, useEffect, useRef } from "react";
import MarkdownRender from "./MarkdownRender";
import Link from "./Link";
import "./Markdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

type MarkdownProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  register?: Function;
  hint?: string;
};

const Markdown = (props: MarkdownProps) => {
  const [disabled, toggle] = useState(true);
  const [boxHeight, setBoxHeight] = useState(142);
  const text = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const height = document.querySelector("textarea")?.clientHeight || 142;
    setBoxHeight(height + 2);
  }, []);

  return (
    <div className="markdown">
      <label htmlFor="markdownarea" className="usa-label text-bold">
        {props.label}
      </label>
      <span className="usa-hint">
        {props.hint} This text area supports limited Markdown.{" "}
        <Link target="_blank" to={"/admin/markdown"}>
          View Markdown Syntax
          <FontAwesomeIcon
            className="margin-left-05"
            icon={faExternalLinkAlt}
            size="xs"
          />
        </Link>
      </span>
      <div className="usa-checkbox margin-top-2">
        <input
          id="toggle"
          checked={!disabled}
          value="preview"
          name="toggle"
          type="checkbox"
          onChange={() => toggle(!disabled)}
          className="usa-checkbox__input"
        />
        <label htmlFor="toggle" className="usa-checkbox__label">
          Preview live text
        </label>
      </div>
      <div hidden={!disabled}>
        <textarea
          id={props.id}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder="Enter text here"
          rows={6}
          ref={(e) => {
            if (props.register) {
              props.register(e);
            }
            text.current = e;
          }}
          className="usa-textarea"
        />
      </div>
      <div
        hidden={disabled}
        className="markdown-box"
        style={{ height: boxHeight }}
      >
        <MarkdownRender source={text.current?.value} />
      </div>
    </div>
  );
};

export default Markdown;
