import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
      <Image
        src="/logo.jpg"
        alt="acongm"
        width={96}
        height={96}
        className="rounded-full mb-6"
        priority
      />
      <h1 className="text-3xl font-bold mb-3">acongm</h1>
      <p className="text-fd-muted-foreground mb-8 max-w-xl">
        前端常用知识、踩坑记录、软件推荐等 — Vue / React / Node / 工程化与面试笔记。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          进入文档
        </Link>
        <Link
          href="/docs/online-tools"
          className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          在线工具
        </Link>
        <Link
          href="/docs/software/cross-platform"
          className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          软件推荐
        </Link>
      </div>
      <p className="mt-12 text-xs text-fd-muted-foreground">
        <a href="http://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          粤ICP备16105234号-1
        </a>
        {' '}
        Copyright © 2022-present Acongm
      </p>
    </div>
  );
}
