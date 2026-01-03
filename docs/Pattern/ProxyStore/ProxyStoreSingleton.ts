// ProxyStoreSingleton.ts - 代理模式单例导出

import { ProxyStore, ProxyStoreSubscriber } from './ProxyStore'

// 单例实例
const store = new ProxyStore<Record<string, any>>()

// legacy wrapper map: subscribeSharedData 会包装 callback，这里保存映射用于正确取消订阅
const legacyWrapperMap = new Map<
  string,
  WeakMap<Function, ProxyStoreSubscriber>
>()

// ========== 类型导出 ==========
export type { ProxyStoreSubscriber }
export type SharedDataSubscriber<T = any> = (data: T) => void

// ========== 最推荐的调用方式（state + subscribe） ==========

export const state = store.proxy

export const subscribe = (
  key: string,
  subscriber: ProxyStoreSubscriber
): (() => void) => {
  return store.subscribe(key, subscriber)
}

export const unsubscribe = (
  key: string,
  subscriber: ProxyStoreSubscriber
): void => {
  store.unsubscribe(key, subscriber)
}

export const getSnapshot = (): Record<string, any> => {
  return store.getSnapshot()
}

export const batchUpdate = (updates: Record<string, any>): void => {
  store.batch(updates)
}

export const resetStore = (newState: Record<string, any> = {}): void => {
  store.reset(newState)
}

// ========== 共享数据（代理模式） ==========

/**
 * 发布共享数据（直接赋值即可）
 */
export const publishSharedData = <T>(key: string, data: T): void => {
  ;(state as any)[key] = data
}

/**
 * 获取共享数据
 */
export const getSharedData = <T>(key: string): T | undefined => {
  return (state as any)[key] as T | undefined
}

/**
 * 清除共享数据
 */
export const clearSharedData = (key: string): void => {
  delete (state as any)[key]
}

/**
 * 订阅共享数据变化
 */
export const subscribeSharedData = <T>(
  key: string,
  callback: SharedDataSubscriber<T>
): void => {
  if (!legacyWrapperMap.has(key)) {
    legacyWrapperMap.set(key, new WeakMap())
  }
  const perKeyMap = legacyWrapperMap.get(key)!

  const wrapper: ProxyStoreSubscriber = (value) => callback(value)
  perKeyMap.set(callback as unknown as Function, wrapper)
  subscribe(key, wrapper)
}

/**
 * 取消订阅共享数据变化
 */
export const unsubscribeSharedData = <T>(
  key: string,
  callback: SharedDataSubscriber<T>
): void => {
  const perKeyMap = legacyWrapperMap.get(key)
  const wrapper = perKeyMap?.get(callback as unknown as Function)
  if (wrapper) {
    unsubscribe(key, wrapper)
    perKeyMap?.delete(callback as unknown as Function)
    return
  }
  // fallback（尽力而为）
  store.unsubscribe(key, callback as unknown as ProxyStoreSubscriber)
}

// ========== 代理模式扩展 API ==========

/**
 * 获取代理对象（可直接操作）
 */
export const getProxy = (): Record<string, any> => {
  return state
}

/**
 * 订阅所有变化
 */
export const subscribeAll = (callback: ProxyStoreSubscriber): (() => void) => {
  return store.subscribeAll(callback)
}

// 导出实例（供高级用法）
export { ProxyStore, store }
