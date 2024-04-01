"use client";

import { useAppDispatch, useAppSelector } from "@lib/hooks";
import { Post, init, post, remove } from "@lib/features/posts/postsSlice";
import Text from "@components/Text";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "styled-components";
import Avatar from "@components/Avatar";
import Input from "@components/Input";
import Textarea from "@components/Textarea";
import Button from "@components/Button";
import Card from "@components/Card";
import List from "@components/List";

export default function Home() {
  const [posting, setPosting] = useState<boolean>(false);
  const [indexToRemove, setIndexToRemove] = useState<number>(-1);
  const [data, setData] = useState<Post>({ name: "", photo: "", message: "" });

  const theme = useTheme();

  const posts = useAppSelector((state) => state.posts.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  const disableSubmit = useMemo(() => {
    return (
      posting ||
      !!Object.keys(data).filter((key) => !data[key as keyof Post]).length
    );
  }, [data, posting]);

  const disabledDiscard = useMemo(() => {
    return (
      posting ||
      !Object.keys(data).filter((key) => !!data[key as keyof Post]).length
    );
  }, [data, posting]);

  function onChange(key: keyof Post, value: string) {
    setData((prevData) => ({ ...prevData, [key]: value }));
  }

  function onDiscard() {
    setPosting(false);
    setData((prevData) =>
      Object.keys(prevData)
        .map((key) => ({ [key]: "" }))
        .reduce((a, b) => Object.assign(a, b), {} as Post)
    );
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!disableSubmit) {
      setPosting(true);
      dispatch(post(data));

      setTimeout(() => onDiscard(), 1000);
    }
  }

  function onRemove(index: number) {
    setIndexToRemove(index);
    setTimeout(() => {
      dispatch(remove({ index }));
      setIndexToRemove(-1);
    }, 1000);
  }

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        backgroundColor: theme.colors.background,
      }}
    >
      <div
        style={{
          width: "100vw",
          display: "flex",
          padding: "1.5rem",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.header,
        }}
      >
        <Image priority alt="logo" width={103} height={45} src="/bx-logo.png" />
      </div>
      <div
        style={{
          gap: 56,
          flex: 1,
          width: "100%",
          maxWidth: 516,
          display: "flex",
          margin: "0 auto",
          overflowY: "auto",
          padding: "41px 16px 0",
          flexDirection: "column",
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            gap: 32,
            padding: 24,
            display: "flex",
            borderRadius: 3,
            flexDirection: "column",
            border: `1px solid ${theme.colors.black}`,
            backgroundColor: theme.colors.black_two,
          }}
        >
          <div
            style={{
              gap: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              size={88}
              radius={36}
              allowSelection
              src={data.photo}
              onSelectFile={(value) => onChange("photo", value)}
            />
            <div
              style={{
                gap: 8,
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Input
                value={data.name}
                disabled={posting}
                placeholder="Digite seu nome"
                onChange={(value) => onChange("name", value)}
              />
              <Textarea
                rows={4}
                disabled={posting}
                value={data.message}
                placeholder="Mensagem"
                onChange={(value) => onChange("message", value)}
              />
            </div>
          </div>
          <div
            style={{
              gap: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="ghost"
              onClick={onDiscard}
              disabled={disabledDiscard}
            >
              Descartar
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              Publicar
            </Button>
          </div>
        </form>
        <div
          style={{
            gap: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text size="sm" weight="medium" color="warm_grey">
            Feed
          </Text>
          <List empty={!posts.length} label=" O seu feed está vazio :(">
            {posting && <Card {...data} posting />}
            {posts
              .filter((_, index) => !posting || !!index)
              .map((item, index) => (
                <Card
                  key={index}
                  {...item}
                  removing={index === indexToRemove}
                  onRemove={() => onRemove(index)}
                />
              ))}
          </List>
        </div>
      </div>
    </main>
  );
}
